import { Pool } from '@uniswap/v3-sdk'
import useMultiChainPositions from 'components/AccountDrawer/MiniPortfolio/Pools/useMultiChainPositions'
import { PoolDetailsPositionsTable } from 'components/Pools/PoolDetails/PoolDetailsPositionsTable'
import { PoolDetailsTransactionsTable } from 'components/Pools/PoolDetails/PoolDetailsTransactionsTable'
import Column from 'components/deprecated/Column'
import Row from 'components/deprecated/Row'
import { useChainFromUrlParam } from 'constants/chains'
import { getSupportedGraphQlChain } from 'graphql/data/util'
import { useAccount } from 'hooks/useAccount'
import styled from 'lib/styled-components'
import { useMemo, useState } from 'react'
import { ClickableStyle, ThemedText } from 'theme/components'
import { ProtocolVersion, Token } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { Trans } from 'uniswap/src/i18n'

enum PoolDetailsTableTabs {
  TRANSACTIONS = 'transactions',
  POSITIONS = 'positions',
}

const TableHeader = styled(ThemedText.HeadlineMedium)<{ active: boolean }>`
  color: ${({ theme, active }) => !active && theme.neutral2};
  ${({ disabled }) => !disabled && ClickableStyle}
  user-select: none;
`

export function PoolDetailsTableTab({
  poolAddress,
  token0,
  token1,
  protocolVersion,
}: {
  poolAddress: string
  token0?: Token
  token1?: Token
  protocolVersion?: ProtocolVersion
}) {
  const [activeTable, setActiveTable] = useState<PoolDetailsTableTabs>(PoolDetailsTableTabs.TRANSACTIONS)
  const chain = getSupportedGraphQlChain(useChainFromUrlParam(), { fallbackToEthereum: true })
  const account = useAccount()
  const { positions } = useMultiChainPositions(account.address ?? '', [chain.id])
  const positionsInThisPool = useMemo(
    () =>
      positions?.filter(
        (position) =>
          Pool.getAddress(position.pool.token0, position.pool.token1, position.pool.fee).toLowerCase() ===
          poolAddress.toLowerCase(),
      ) ?? [],
    [poolAddress, positions],
  )
  return (
    <Column gap="lg">
      <Row gap="16px">
        <TableHeader
          active={activeTable === PoolDetailsTableTabs.TRANSACTIONS}
          onClick={() => setActiveTable(PoolDetailsTableTabs.TRANSACTIONS)}
          disabled={!positionsInThisPool.length}
        >
          <Trans i18nKey="common.transactions" />
        </TableHeader>
        {Boolean(positionsInThisPool.length) && (
          <TableHeader
            active={activeTable === PoolDetailsTableTabs.POSITIONS}
            onClick={() => setActiveTable(PoolDetailsTableTabs.POSITIONS)}
          >
            <Trans i18nKey="pool.positions" />
            {` (${positionsInThisPool?.length})`}
          </TableHeader>
        )}
      </Row>
      {activeTable === PoolDetailsTableTabs.TRANSACTIONS ? (
        <PoolDetailsTransactionsTable
          poolAddress={poolAddress}
          token0={token0}
          token1={token1}
          protocolVersion={protocolVersion}
        />
      ) : (
        <PoolDetailsPositionsTable positions={positionsInThisPool} />
      )}
    </Column>
  )
}
