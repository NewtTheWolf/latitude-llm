import { env } from '@latitude-data/env'

import {
  DEFAULT_PROVIDER_MAX_FREE_RUNS,
  ProviderApiKey,
  RunErrorCodes,
  Workspace,
} from '../../../browser'
import { Result } from '../../../lib'
import { incrFreeRuns } from '../../freeRunsManager'
import { ChainError } from '../ChainErrors'

export async function checkFreeProviderQuota({
  workspace,
  provider,
}: {
  workspace: Workspace
  provider: ProviderApiKey
}) {
  if (provider.token !== env.DEFAULT_PROVIDER_API_KEY) {
    return Result.ok(true)
  }
  const value = await incrFreeRuns(workspace.id)
  if (value <= DEFAULT_PROVIDER_MAX_FREE_RUNS) return Result.ok(true)

  return Result.error(
    new ChainError({
      code: RunErrorCodes.DefaultProviderExceededQuota,
      message: 'You have exceeded your maximum number of free runs for today',
    }),
  )
}