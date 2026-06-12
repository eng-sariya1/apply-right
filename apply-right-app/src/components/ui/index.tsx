import { forwardRef, type ReactNode } from 'react';
import {
  View,
  Text as RNText,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  TextInput as RNTextInput,
  ActivityIndicator,
  Image as RNImage,
  FlatList as RNFlatList,
  Platform,
  type ViewProps,
  type TextProps as RNTextProps,
  type PressableProps as RNPressableProps,
  type ScrollViewProps,
  type TextInputProps,
  type ImageProps,
  type FlatListProps,
} from 'react-native';
import { cssInterop } from 'nativewind';
import { brand, colors } from '../../theme/colors';

cssInterop(View, { className: 'style' });
cssInterop(RNText, { className: 'style' });
cssInterop(RNPressable, { className: 'style' });
cssInterop(RNScrollView, { className: { target: 'style' }, contentContainerClassName: { target: 'contentContainerStyle' } });
cssInterop(RNTextInput, { className: 'style', placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } } });
cssInterop(RNImage, { className: 'style' });
cssInterop(RNFlatList, {
  className: { target: 'style' },
  contentContainerClassName: { target: 'contentContainerStyle' },
});

type ClassProps = { className?: string };

const CARD_SHADOW = Platform.select({
  ios: {
    shadowColor: brand.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  android: { elevation: 3 },
  default: {},
});

const BUTTON_SHADOW = Platform.select({
  ios: {
    shadowColor: brand.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  android: { elevation: 5 },
  default: {},
});

// ────────────────────────── Box / Stacks ──────────────────────────
export const Box = forwardRef<View, ViewProps & ClassProps>(({ className, ...rest }, ref) => (
  <View ref={ref} className={className} {...rest} />
));
Box.displayName = 'Box';

export const HStack = forwardRef<View, ViewProps & ClassProps & { space?: number }>(
  ({ className = '', space, style, ...rest }, ref) => (
    <View
      ref={ref}
      className={`flex-row ${className}`}
      style={[space != null ? { gap: space } : null, style]}
      {...rest}
    />
  ),
);
HStack.displayName = 'HStack';

export const VStack = forwardRef<View, ViewProps & ClassProps & { space?: number }>(
  ({ className = '', space, style, ...rest }, ref) => (
    <View
      ref={ref}
      className={`flex-col ${className}`}
      style={[space != null ? { gap: space } : null, style]}
      {...rest}
    />
  ),
);
VStack.displayName = 'VStack';

export const Center = forwardRef<View, ViewProps & ClassProps>(({ className = '', ...rest }, ref) => (
  <View ref={ref} className={`items-center justify-center ${className}`} {...rest} />
));
Center.displayName = 'Center';

export const Divider = ({ className = '' }: ClassProps) => (
  <View className={`h-px w-full bg-border-light dark:bg-border-dark ${className}`} />
);

// ────────────────────────── Text / Heading ──────────────────────────
type TextProps = RNTextProps & ClassProps;

export const Text = forwardRef<RNText, TextProps>(({ className = '', ...rest }, ref) => (
  <RNText
    ref={ref}
    className={`font-[Inter_300Light] text-text-dark-light dark:text-text-dark-dark ${className}`}
    {...rest}
  />
));
Text.displayName = 'Text';

export const Heading = forwardRef<RNText, TextProps & { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }>(
  ({ className = '', size = 'lg', ...rest }, ref) => {
    const sizeClass = {
      sm: 'text-base tracking-tight',
      md: 'text-lg tracking-tight',
      lg: 'text-xl tracking-tight',
      xl: 'text-2xl tracking-tighter',
      '2xl': 'text-3xl tracking-tightest',
    }[size];
    return (
      <RNText
        ref={ref}
        className={`font-[Inter_700Bold] font-bold text-text-dark-light dark:text-text-dark-dark ${sizeClass} ${className}`}
        {...rest}
      />
    );
  },
);
Heading.displayName = 'Heading';

// ────────────────────────── Pressable / Button ──────────────────────────
export const Pressable = forwardRef<View, RNPressableProps & ClassProps>(
  ({ className, ...rest }, ref) => <RNPressable ref={ref as any} className={className} {...rest} />,
);
Pressable.displayName = 'Pressable';

type ButtonVariant = 'solid' | 'outline' | 'link' | 'ghost';
type ButtonProps = RNPressableProps &
  ClassProps & {
    variant?: ButtonVariant;
    isDisabled?: boolean;
    isLoading?: boolean;
    children: ReactNode;
  };

export const Button = forwardRef<View, ButtonProps>(
  ({ className = '', variant = 'solid', isDisabled, isLoading, style, children, ...rest }, ref) => {
    const base = 'flex-row items-center justify-center rounded-2xl px-4 py-4 active:opacity-70';
    const variantClass = {
      solid: 'bg-primary',
      outline: 'border-2 border-primary bg-transparent',
      link: 'bg-transparent px-0 py-0',
      ghost: 'bg-transparent',
    }[variant];
    const disabled = isDisabled || isLoading ? 'opacity-60' : '';
    const shadowStyle = variant === 'solid' && !isDisabled && !isLoading ? BUTTON_SHADOW : undefined;
    return (
      <RNPressable
        ref={ref as any}
        disabled={isDisabled || isLoading}
        className={`${base} ${variantClass} ${disabled} ${className}`}
        style={[shadowStyle, style as any]}
        {...rest}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : children}
      </RNPressable>
    );
  },
);
Button.displayName = 'Button';

export const ButtonText = ({
  className = '',
  variant = 'solid',
  children,
}: ClassProps & { variant?: ButtonVariant; children: ReactNode }) => {
  const colorClass = variant === 'outline' || variant === 'link' || variant === 'ghost' ? 'text-primary' : 'text-white';
  return (
    <RNText className={`font-[Inter_700Bold] font-bold text-base tracking-tight ${colorClass} ${className}`}>
      {children}
    </RNText>
  );
};

// ────────────────────────── Input ──────────────────────────
export const Input = ({ className = '', children }: ClassProps & { children: ReactNode }) => (
  <View
    className={`flex-row items-center rounded-xl border-2 border-border-light bg-surface-light dark:border-border-dark dark:bg-surface-dark ${className}`}
  >
    {children}
  </View>
);

export const InputField = forwardRef<RNTextInput, TextInputProps & ClassProps>(
  ({ className = '', ...rest }, ref) => (
    <RNTextInput
      ref={ref}
      className={`flex-1 px-4 py-3.5 text-base font-[Inter_300Light] text-text-dark-light dark:text-text-dark-dark ${className}`}
      placeholderTextColor={brand.placeholder}
      {...rest}
    />
  ),
);
InputField.displayName = 'InputField';

export const InputSlot = ({ className = '', children }: ClassProps & { children: ReactNode }) => (
  <View className={`px-3 ${className}`}>{children}</View>
);

// ────────────────────────── ScrollView / FlatList / Image ──────────────────────────
export const ScrollView = forwardRef<RNScrollView, ScrollViewProps & ClassProps & { contentContainerClassName?: string }>(
  ({ className, contentContainerClassName, ...rest }, ref) => (
    <RNScrollView
      ref={ref}
      className={className}
      contentContainerClassName={contentContainerClassName}
      {...rest}
    />
  ),
);
ScrollView.displayName = 'ScrollView';

export function FlatList<T>(props: FlatListProps<T> & ClassProps & { contentContainerClassName?: string }) {
  return <RNFlatList {...(props as any)} />;
}

export const Image = forwardRef<RNImage, ImageProps & ClassProps>(({ className, ...rest }, ref) => (
  <RNImage ref={ref} className={className} {...rest} />
));
Image.displayName = 'Image';

// ────────────────────────── Spinner ──────────────────────────
export const Spinner = ({ size = 'large', color = colors.light.primary }: { size?: 'small' | 'large'; color?: string }) => (
  <ActivityIndicator size={size} color={color} />
);

// ────────────────────────── Card ──────────────────────────
export const Card = ({ className = '', style, children }: ClassProps & { style?: object; children: ReactNode }) => (
  <View
    className={`rounded-2xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark ${className}`}
    style={[CARD_SHADOW, style]}
  >
    {children}
  </View>
);

// ────────────────────────── Provider ──────────────────────────
export function GluestackUIProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
