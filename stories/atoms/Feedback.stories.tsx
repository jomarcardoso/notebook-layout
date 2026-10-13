// notebook-layout/stories/atoms/Feedback.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button, Progress, SkeletonText, Waiting } from '@components/atoms';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atoms/Feedback',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Skeleton: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Typographic shape"
        note="The skeleton draws the shape of what is coming, not generic rectangles: each line becomes a thin bar centred on the rhythm line, with the letter height of that role. Seen from afar, a skeleton paragraph has the same outline as a real paragraph, and swapping it for the real content moves nothing around it."
      >
        <div aria-busy="true" style={{ maxInlineSize: '30rem' }}>
          <div className="title-md">
            <span
              className="skeleton skeleton-line"
              style={{ inlineSize: '70%' }}
            />
          </div>
          <p className="body">
            <SkeletonText lines={4} />
          </p>
        </div>
      </Group>

      <Group
        title="Side by side with the content"
        note="The same measure, the same rhythm. If the skeleton and the text do not take the same space, the page jumps when the content arrives."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-space-lg)',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <p className="body">
            Bata as claras em neve e reserve. Misture a farinha peneirada com o
            fermento e junte as gemas, mexendo devagar ate a massa ficar lisa.
          </p>
          <p className="body" aria-busy="true">
            <SkeletonText lines={4} />
          </p>
        </div>
      </Group>
    </Sheet>
  ),
};

const ProgressDemo = () => {
  const [value, setValue] = useState(12);

  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 450);

    return () => clearInterval(id);
  }, []);

  return (
    <Sheet>
      <Group
        title="Progress bar"
        note="A rule that fills with ink: the track is the system rule, 4px and without radius, and what advances is solid neutral ink. It always comes with the VALUE WRITTEN beside it — so the track does not carry the information alone."
      >
        <div style={{ maxInlineSize: '24rem' }}>
          <Progress label="Enviando a imagem" value={value} />
        </div>
      </Group>

      <Group
        title="Spinner"
        note="A ring the size of an icon, with an icon's stroke, in currentColor: it behaves as a system icon and takes the ink of where it sits. Alone in a region, it appears after 300ms."
      >
        <Waiting />
      </Group>

      <Group
        title="Loading button"
        note="The feedback stays where the eye already is. The button keeps shape, colour and width; the label fades out by opacity and stays in place, so the width and the accessible name stay."
      >
        <Row label="in progress">
          <Button weight="commitment" loading>
            Guardar receita
          </Button>
        </Row>
      </Group>

      <p className="caption">
        Progress without a measure does not exist as a bar. If there is no way
        to know how much is left, the feedback is the spinner.
      </p>
    </Sheet>
  );
};

export const ProgressStory: Story = {
  name: 'Progress',
  render: () => <ProgressDemo />,
};
