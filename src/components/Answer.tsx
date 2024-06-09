import { useAI } from "../lib/store";

type Props = {};

const Answer = ({}: Props) => {
  const { predictions, predictionsPrec } = useAI();
  return (
    <div>
      {predictions.map((p) => (
        <p>{p}</p>
      ))}
      {predictionsPrec.map((p) => (
        <p>{p}</p>
      ))}
    </div>
  );
};

export default Answer;
