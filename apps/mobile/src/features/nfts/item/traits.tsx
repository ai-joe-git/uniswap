import dayjs from 'dayjs'
import React from 'react'
import { ListRenderItemInfo, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { Flex, Text, useSporeColors } from 'ui/src'
import { spacing } from 'ui/src/theme'
import { NftAssetTrait } from 'uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks'

const formatTraitValue = (trait: NftAssetTrait): string | undefined => {
  if (!trait.value) {
    return undefined
  }

  if (trait.name?.toLowerCase().split(' ').includes('date')) {
    const date = dayjs(+trait.value * 1000)
    return date.isValid() ? date.format('MMM D, YYYY') : trait.value
  }

  return trait.value
}

export function NFTTraitCard({
  trait,
  titleTextColor,
}: {
  trait: NftAssetTrait
  titleTextColor?: string
}): JSX.Element {
  const colors = useSporeColors()

  return (
    <Flex backgroundColor="$surface3" borderRadius="$rounded16" gap="$spacing4" px="$spacing16" py="$spacing12">
      <Text fontSize={14} style={{ color: titleTextColor ?? colors.neutral2.get() }} variant="buttonLabel2">
        {trait.name}
      </Text>
      <Text color="$neutral1" variant="subheading2">
        {formatTraitValue(trait)}
      </Text>
    </Flex>
  )
}

export function NFTTraitList({
  traits,
  titleTextColor = 'neutral1',
}: {
  traits: NftAssetTrait[]
  titleTextColor?: string
}): JSX.Element {
  function renderItem(item: ListRenderItemInfo<NftAssetTrait>): JSX.Element {
    return <NFTTraitCard titleTextColor={titleTextColor} trait={item.item} />
  }

  return (
    <FlatList
      ItemSeparatorComponent={Separator}
      contentContainerStyle={Styles.listContainer}
      data={traits}
      horizontal={true}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  )
}

function Separator(): JSX.Element {
  return <Flex width={spacing.spacing8} />
}

const Styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: spacing.spacing24,
  },
})
