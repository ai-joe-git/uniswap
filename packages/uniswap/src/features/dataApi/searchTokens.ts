import { useCallback, useMemo } from 'react'
import { Chain, useSearchTokensQuery } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'
import { GqlResult } from 'uniswap/src/data/types'
import { toGraphQLChain } from 'uniswap/src/features/chains/utils'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { gqlTokenToCurrencyInfo, usePersistedError } from 'uniswap/src/features/dataApi/utils'
import { UniverseChainId } from 'uniswap/src/types/chains'

export const ALL_GQL_CHAINS = Object.values(Chain)

export function useSearchTokens(
  searchQuery: string | null,
  chainFilter: UniverseChainId | null,
  skip: boolean,
): GqlResult<CurrencyInfo[]> {
  const gqlChainFilter = chainFilter ? toGraphQLChain(chainFilter) : null
  const { data, loading, error, refetch } = useSearchTokensQuery({
    variables: {
      searchQuery: searchQuery ?? '',
      chains: gqlChainFilter ? [gqlChainFilter] : ALL_GQL_CHAINS,
    },
    skip,
  })

  const persistedError = usePersistedError(loading, error)

  const formattedData = useMemo(() => {
    if (!data || !data.searchTokens) {
      return undefined
    }

    return data.searchTokens
      .map((token) => {
        if (!token) {
          return null
        }

        return gqlTokenToCurrencyInfo(token)
      })
      .filter((c): c is CurrencyInfo => Boolean(c))
  }, [data])

  const retry = useCallback(() => !skip && refetch({ searchQuery: searchQuery ?? '' }), [refetch, searchQuery, skip])

  return useMemo(
    () => ({ data: formattedData, loading, error: persistedError, refetch: retry }),
    [formattedData, loading, retry, persistedError],
  )
}
