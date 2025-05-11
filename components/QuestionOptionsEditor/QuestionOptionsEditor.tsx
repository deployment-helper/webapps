import { Button, Radio, RadioGroup } from '@fluentui/react-components';
import { DeleteRegular } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface QuestionOptionsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const QuestionOptionsEditor = ({
  value,
  onChange,
}: QuestionOptionsEditorProps) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState<number>(0);

  useEffect(() => {
    try {
      const parsedOptions = JSON.parse(value);
      setOptions(parsedOptions);
      const correctIndex = parsedOptions.findIndex(
        (opt: Option) => opt.isCorrect,
      );
      setSelectedCorrectIndex(correctIndex >= 0 ? correctIndex : 0);
    } catch (e) {
      setOptions([{ text: '', isCorrect: true }]);
    }
  }, []);

  const updateOptions = (newOptions: Option[]) => {
    setOptions(newOptions);
    onChange(JSON.stringify(newOptions));
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    updateOptions(newOptions);
  };

  const handleCorrectAnswerChange = (_: any, data: { value: string }) => {
    const correctIndex = parseInt(data.value);
    setSelectedCorrectIndex(correctIndex);

    const newOptions = options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === correctIndex,
    }));
    updateOptions(newOptions);
  };

  const addOption = () => {
    updateOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return; // Maintain minimum 2 options

    const newOptions = options.filter((_, idx) => idx !== index);
    if (index === selectedCorrectIndex) {
      // If removing correct answer, set first option as correct
      newOptions[0].isCorrect = true;
      setSelectedCorrectIndex(0);
    } else if (index < selectedCorrectIndex) {
      // Adjust selected index if removing option before it
      setSelectedCorrectIndex(selectedCorrectIndex - 1);
    }
    updateOptions(newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionTextChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 rounded border p-2"
            />
            <Button
              icon={<DeleteRegular />}
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
            />
          </div>
        ))}
      </div>

      <Button appearance="secondary" onClick={addOption}>
        Add Option
      </Button>

      <div className="mt-4">
        <div className="mb-2 font-semibold">Correct Answer:</div>
        <RadioGroup
          value={selectedCorrectIndex.toString()}
          onChange={handleCorrectAnswerChange}
        >
          {options.map((option, index) => (
            <Radio
              key={index}
              value={index.toString()}
              label={option.text || `Option ${index + 1}`}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default QuestionOptionsEditor;
