/**
 *
 * WHAT: SMK-005 test to issue a certificate through ACME protocol, now just to explore the k8s cluster on what have been already installed (cert-manager, ingress-nginx) and what permissions we have
 * 
 * WHY: because we don't know concrete versions, names, and namespaces in the cluster 
 * 
 * HOW: we send read-only requests via k8sClient to get:
 *      1. list of namespaces
 *      2. pods in cert-manager namespace
 *      3. ingress classes
 *      4. CRDs with cert-manager.io suffix
 *      5. SelfSubjectAccessReview for critical operations (create Issuer/Certificate/Secret/Ingress)
 *      6. we print everything to the logs via Logger
 */

import { test } from '../../fixtures/testFixtures';
import {
    getCoreApi,
    getCustomObjectsApi,
    getNetworkingApi,
    getAuthorizationApi,
} from '../../utils/k8sClient';
import { Logger } from '../../utils/Logger';

const logger = new Logger('AcmeSmokeTest');

test.describe('@smoke acme', () => {
    test('SMK-005: reconnaissance — what is available in the cluster', async () => {
        await test.step('List all namespaces', async () => {
            const coreApi = getCoreApi();
            const nsList = await coreApi.listNamespace();
            const names = nsList.items.map(ns => ns.metadata?.name);
            logger.info(`Found ${names.length} namespaces: ${names.join(', ')}`);
        });

    });
});
