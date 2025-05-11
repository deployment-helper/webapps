import { forwardRef, useRef } from 'react';
import { ILayoutProps } from '@/components/layouts/types';
import LayoutBody from '@/components/layouts/LayoutBody';
import useResizeFont from '@/hooks/useResizeFont';
import {
  CheckmarkCircle24Filled,
  DismissCircle24Filled,
} from '@fluentui/react-icons';

interface Option {
  text: string;
  isCorrect: boolean;
}

export const HeaderOptions = forwardRef<HTMLDivElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone }: ILayoutProps, ref) => {
    const questionRef = useRef<HTMLDivElement>(null);
    const fontSize = useResizeFont(questionRef.current);

    let options: Option[] = [];
    try {
      options = JSON.parse(content?.options?.value || '[]');
    } catch (e) {
      console.error('Failed to parse options JSON');
    }

    const showAnswer = content?.isShowAnswer?.value === 'true';

    return (
      <LayoutBody isNone={isDisplayNone} ref={ref} sceneId={sceneId}>
        <div className="flex h-full w-full flex-col">
          <div
            ref={questionRef}
            className="flex w-full items-center justify-center bg-violet-600 p-6 text-white"
            style={{ fontSize }}
          >
            {content?.question?.value}
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            {options.map((option, index) => (
              <div
                key={index}
                className={`flex w-2/3 items-center justify-between rounded-lg border-2 ${
                  showAnswer
                    ? option.isCorrect
                      ? 'border-green-600 bg-green-50'
                      : 'border-red-600 bg-red-50'
                    : 'border-violet-600 hover:bg-violet-100'
                } p-4`}
              >
                <span className="text-2xl">{option.text}</span>
                {showAnswer &&
                  (option.isCorrect ? (
                    <CheckmarkCircle24Filled className="text-green-600" />
                  ) : (
                    <DismissCircle24Filled className="text-red-600" />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </LayoutBody>
    );
  },
);

HeaderOptions.displayName = 'HeaderOptions';

export default HeaderOptions;
