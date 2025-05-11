import React, { forwardRef, useRef } from 'react';
import {
  Text,
  makeStyles,
  tokens,
  shorthands,
  Button,
} from '@fluentui/react-components';
import { ArrowLeft24Regular } from '@fluentui/react-icons';
import { useRouter } from 'next/navigation';
import { ILayoutProps } from './types';
import LayoutBody from './LayoutBody';
import useResizeFont from '@/hooks/useResizeFont';

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  contentContainer: {
    ...shorthands.padding('24px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  answerSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  correctAnswer: {
    color: tokens.colorPaletteGreenForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase500,
  },
  explanationHeading: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground1,
  },
  explanationText: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase400,
  },
});

const HeaderAnswerExplanation = forwardRef<HTMLDivElement, ILayoutProps>(
  ({ content, sceneId, isDisplayNone }: ILayoutProps, ref) => {
    const styles = useStyles();
    const router = useRouter();
    const questionRef = useRef<HTMLDivElement>(null);
    const fontSize = useResizeFont(questionRef.current);

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

          <div className={styles.contentContainer}>
            <div className={styles.answerSection}>
              <Text className={styles.correctAnswer}>
                Correct Answer: {content?.correctAnswer?.value}
              </Text>
            </div>

            <div className={styles.answerSection}>
              <Text className={styles.explanationHeading}>Explanation:</Text>
              <Text className={styles.explanationText}>
                {content?.explanation?.value}
              </Text>
            </div>
          </div>
        </div>
      </LayoutBody>
    );
  },
);

HeaderAnswerExplanation.displayName = 'HeaderAnswerExplanation';

export default HeaderAnswerExplanation;
