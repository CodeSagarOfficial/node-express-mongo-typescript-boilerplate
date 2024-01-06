interface IEnvironment {
  port: number
  auth: {
    secretKey: string
    secretPeriod: string
    refreshKey: string
    refreshPeriod: string
    sessionType: string
  }
  mongodb: {
    url: string
  }

  getCurrentEnvironment(): string
  setEnvironment(env: string): void
  isProductionEnvironment(): boolean
  isDevEnvironment(): boolean
  isTestEnvironment(): boolean
  isStagingEnvironment(): boolean
}

export default IEnvironment
