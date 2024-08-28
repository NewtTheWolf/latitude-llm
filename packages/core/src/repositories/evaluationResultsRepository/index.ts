import { eq, getTableColumns } from 'drizzle-orm'

import { Commit, DocumentLog } from '../../browser'
import { Result } from '../../lib'
import { documentLogs, evaluationResults, evaluations } from '../../schema'
import Repository from '../repository'

export type DocumentLogWithMetadata = DocumentLog & {
  commit: Commit
  tokens: number | null
  cost_in_millicents: number | null
}

export class EvaluationResultsRepository extends Repository {
  get scope() {
    return this.db
      .select(getTableColumns(evaluationResults))
      .from(evaluationResults)
      .innerJoin(
        evaluations,
        eq(evaluations.id, evaluationResults.evaluationId),
      )
      .as('evaluationResultsScope')
  }

  async findByDocumentUuid(uuid: string) {
    const result = await this.db
      .select(this.scope._.selectedFields)
      .from(this.scope)
      .innerJoin(documentLogs, eq(documentLogs.id, this.scope.documentLogId))
      .where(eq(documentLogs.documentUuid, uuid))

    return Result.ok(result)
  }
}