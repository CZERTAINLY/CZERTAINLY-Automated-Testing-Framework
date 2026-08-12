/**
 * k8sClient — centralized Kubernetes API access for test code.
 *
 * WHAT: k8s API client to do centralized authorization and exposes typed API clients (CoreV1Api, NetworkingV1Api, CustomObjectsApi, AuthorizationV1Api).
 * 
 * WHY: tests need to manage k8s resources (Issuer, Certificate, Secret) but shouldn't repeat auth setup.
 * 
 * HOW: 1. In-cluster first: testkube agent lives in-cluster and should have its own ServiceAccount aka service user with permissions.
 *          loadFromCluster() reads the ServiceAccount token that k8s mounts into every pod at
 *      /var/run/secrets/kubernetes.io/serviceaccount/token.
 *      Works when the test runs inside the Testkube pod.
 *      2. Fallback: loadFromFile(process.env.KUBECONFIG_PATH) - for local dev with a kubeconfig file.
 *      3. If neither works — throw an error e.g. no k8s auth available: neither in-cluster service account token nor KUBECONFIG_PATH set.
 *      4. Expose typed k8s API clients — CoreV1Api, NetworkingV1Api, CustomObjectsApi, AuthorizationV1Api as getter functions so callers don't reload auth per request.
 */

/**
 *  CoreV1Api — namespaces, pods, secrets, services
 *  NetworkingV1Api — Ingress
 *  CustomObjectsApi — cert-manager CRD(Issuer, Certificate)
 *  AuthorizationV1Api — check for permissions (SelfSubjectAccessReview)
 */
import { KubeConfig, CoreV1Api, NetworkingV1Api, CustomObjectsApi, AuthorizationV1Api } from '@kubernetes/client-node';
import { Logger } from './Logger';

const logger = new Logger('K8sClient');

let kc: KubeConfig | undefined;

export function getKubeConfig(): KubeConfig {
    // checking cache (early return) - lazy initialization
    if (kc) return kc;

    const newKc = new KubeConfig();
    if (process.env.KUBERNETES_SERVICE_HOST) {
        try {
            newKc.loadFromCluster();
            logger.info('Loaded k8s config from in-cluster ServiceAccount');
            kc = newKc;
            return kc;
        } catch (e) {
            logger.debug(`loadFromCluster failed: ${e}. Trying KUBECONFIG_PATH fallback.`);
        }
    } else {
        logger.debug('Not running in-cluster (KUBERNETES_SERVICE_HOST not set), trying KUBECONFIG_PATH fallback.');
    }

    const path = process.env.KUBECONFIG_PATH;
    if (path) {
        newKc.loadFromFile(path);
        logger.info(`Loaded k8s config from file: ${path}`);
        kc = newKc;
        return kc;
    }
    throw new Error(
        'No k8s auth available: neither in-cluster ServiceAccount token nor KUBECONFIG_PATH found. ' +
        'Run inside a Testkube pod or set KUBECONFIG_PATH in .env.'
    );
}

export function getCoreApi(): CoreV1Api {
    return getKubeConfig().makeApiClient(CoreV1Api);
}

export function getNetworkingApi(): NetworkingV1Api {
    return getKubeConfig().makeApiClient(NetworkingV1Api);
}

export function getCustomObjectsApi(): CustomObjectsApi {
    return getKubeConfig().makeApiClient(CustomObjectsApi);
}

export function getAuthorizationApi(): AuthorizationV1Api {
    return getKubeConfig().makeApiClient(AuthorizationV1Api);
}