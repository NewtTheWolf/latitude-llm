import { faker } from '@faker-js/faker'
import { v4 as uuid } from 'uuid'

import { LogSources, ProviderLog, Providers } from '../../browser'
import { createProviderLog as createProviderLogService } from '../../services/providerLogs'

export type IProviderLogData = {
  documentLogUuid: string
  providerId: number
  providerType: Providers
  model?: string
  tokens?: number
  duration?: number
  source?: LogSources
  costInMillicents?: number
}

export async function createProviderLog(
  data: IProviderLogData,
): Promise<ProviderLog> {
  const providerLog = await createProviderLogService({
    uuid: uuid(),
    generatedAt: new Date(),
    documentLogUuid: data.documentLogUuid,
    providerId: data.providerId,
    providerType: data.providerType,
    model: data.model ?? faker.lorem.word(),
    config: {},
    messages: [],
    responseText: faker.lorem.sentence(),
    toolCalls: [],
    usage: {
      promptTokens: data.tokens ?? faker.number.int({ min: 10, max: 100 }),
      completionTokens: data.tokens ?? faker.number.int({ min: 10, max: 100 }),
      totalTokens: data.tokens ?? faker.number.int({ min: 20, max: 200 }),
    },
    duration: data.duration ?? faker.number.int({ min: 100, max: 5000 }),
    source: data.source ?? LogSources.Playground,
    costInMillicents:
      data.costInMillicents ?? faker.number.int({ min: 100, max: 5000 }),
  }).then((r) => r.unwrap())

  return providerLog
}