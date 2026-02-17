/**
 * P31 Product Icon — Unicode symbol + product color.
 * Use for product cards, navigation, badges. Single source of truth.
 */

import React from 'react';
import {
  P31_PRODUCT_ICONS,
  P31_PRODUCT_COLORS,
  P31_PRODUCT_NAMES,
  type P31ProductId,
} from '../../config/p31-icons';

interface P31ProductIconProps {
  product: P31ProductId;
  size?: number;
  className?: string;
  ariaHidden?: boolean;
}

export function P31ProductIcon({
  product,
  size = 24,
  className = '',
  ariaHidden = true,
}: P31ProductIconProps): React.ReactElement {
  const char = P31_PRODUCT_ICONS[product];
  const color = P31_PRODUCT_COLORS[product];
  const name = P31_PRODUCT_NAMES[product];

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        fontSize: size,
        lineHeight: 1,
        color,
      }}
      role="img"
      {...(ariaHidden ? { 'aria-hidden': 'true' } : { 'aria-label': name })}
    >
      {char}
    </span>
  );
}

export { P31_PRODUCT_ICONS, P31_PRODUCT_COLORS, P31_PRODUCT_NAMES };
