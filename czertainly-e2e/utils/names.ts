export function uniqueName(prefix: string): string {
  const buildId = process.env.GITHUB_RUN_ID ?? process.env.CI_BUILD_ID ?? 'local';
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${buildId}-${ts}`;
}
