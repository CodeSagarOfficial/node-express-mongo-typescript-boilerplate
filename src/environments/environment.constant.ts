enum Environments {
  LOCAL = 'local',
  PRODUCTION = 'production',
  DEV = 'dev',
  TEST = 'test',
  QA = 'qa',
  STAGING = 'staging',
}

enum EnvironmentFile {
  LOCAL = '.env',
  PRODUCTION = '.env.prod',
  DEV = '.env.dev',
  TEST = '.env.test',
  QA = '.env.qa',
  STAGING = '.env.stage',
}

export { Environments, EnvironmentFile }
