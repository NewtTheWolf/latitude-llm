import { Workspace } from '@latitude-data/core/browser'
import { CommitsRepository } from '@latitude-data/core/repositories'
import { computeDocumentLogsWithMetadataQuery } from '@latitude-data/core/services/documentLogs/computeDocumentLogsWithMetadata'
import { authHandler } from '$/middlewares/authHandler'
import { errorHandler } from '$/middlewares/errorHandler'
import { NextRequest, NextResponse } from 'next/server'

export const GET = errorHandler(
  authHandler(
    async (
      req: NextRequest,
      {
        params,
        workspace,
      }: {
        params: {
          projectId: string
          commitUuid: string
          documentUuid: string
        }
        workspace: Workspace
      },
    ) => {
      const { projectId, commitUuid, documentUuid } = params
      const searchParams = req.nextUrl.searchParams
      const commitsScope = new CommitsRepository(workspace.id)
      const commit = await commitsScope
        .getCommitByUuid({ projectId: Number(projectId), uuid: commitUuid })
        .then((r) => r.unwrap())

      const page = searchParams.get('page') ?? '1'
      const pageSize = searchParams.get('pageSize') ?? '25'
      const rows = await computeDocumentLogsWithMetadataQuery({
        workspaceId: workspace.id,
        documentUuid,
        draft: commit,
        page,
        pageSize,
      })

      return NextResponse.json(rows, { status: 200 })
    },
  ),
)
