type TransactionEmojiProps = {
  emoji: string;
};

const TransactionEmoji: React.FC<TransactionEmojiProps> = ({ emoji }) => {
  return (
    <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
      <span className="text-xl">{emoji}</span>
    </div>
  );
};

export default TransactionEmoji;
