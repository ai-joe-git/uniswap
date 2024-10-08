import { isWeb } from 'tamagui'
import { Flex, FlexProps } from 'ui/src/components/layout/Flex'
import { Text, TextProps } from 'ui/src/components/text/Text'
import { usePostTextElementPositionProps } from 'ui/src/utils/layout'

type ElementAfterTextProps = {
  element?: JSX.Element
  text: string
  wrapperProps?: FlexProps
  textProps?: TextProps
}

const DEFAULT_TEXT_PROPS: TextProps = {
  color: '$neutral1',
  variant: 'body2',
}

export function ElementAfterText({ element, text, wrapperProps, textProps }: ElementAfterTextProps): JSX.Element {
  const { postTextElementPositionProps, onTextLayout } = usePostTextElementPositionProps()

  if (isWeb) {
    return (
      <Flex row {...wrapperProps}>
        <Text {...DEFAULT_TEXT_PROPS} {...textProps}>
          {text}
          {element}
        </Text>
      </Flex>
    )
  } else {
    return (
      <Flex row pr={postTextElementPositionProps ? '$spacing24' : undefined} {...wrapperProps}>
        <Text {...DEFAULT_TEXT_PROPS} onTextLayout={onTextLayout} {...textProps}>
          {text}
        </Text>
        <Flex {...postTextElementPositionProps}>{element}</Flex>
      </Flex>
    )
  }
}
