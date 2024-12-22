interface EmojiProps {
    symbol: string;
    label?: string;
    className?: string;
}

export const Emoji = ({ symbol, label, className = '' }: EmojiProps) => (
    <span
        className={`joypixels ${className}`}
        role="img"
        aria-label={label || ""}
        aria-hidden={!label}
    >
    {symbol}
  </span>
);