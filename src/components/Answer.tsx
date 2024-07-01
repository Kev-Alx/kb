import { useAI } from "../lib/store";

type Props = {};

const Answer = ({}: Props) => {
  const { predictions, predictionsPrec } = useAI();
  return (
    <div className="flex gap-8">
      <div>
        {predictions.map((p) => (
          <p>{p}</p>
        ))}
      </div>
      <div>
        {predictionsPrec.map((p) => (
          <p>{p}</p>
        ))}
      </div>
    </div>
  );
};

export default Answer;
