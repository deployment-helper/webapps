import {
  MessageBar,
  MessageBarBody,
  MessageBarGroup,
  MessageBarTitle,
  Link,
  MessageBarActions,
  Button,
} from "@fluentui/react-components";

import { DismissRegular } from "@fluentui/react-icons";
import { useVideoStore } from "@/src/stores/video.store";

export function MyMessageBar() {
  const removeMessage = useVideoStore((state) => state.removeMessage);
  const messages = useVideoStore((state) => state.messageBar);

  return (
    <div className={"absolute top-10 flex w-full justify-center"}>
      <MessageBarGroup animate={"both"}>
        {messages.map((message, index) => (
          <MessageBar key={message.id} intent={message.intent}>
            <MessageBarBody>
              <MessageBarTitle>{message.title}</MessageBarTitle>
              {message.body}
              <Link target={"_blank"} href={message.link?.url} onClick={() => removeMessage(message.id)}>
                {message.link?.text}
              </Link>
            </MessageBarBody>
            <MessageBarActions
              containerAction={
                <Button
                  onClick={() => removeMessage(message.id)}
                  aria-label="dismiss"
                  appearance="transparent"
                  icon={<DismissRegular />}
                />
              }
            />
          </MessageBar>
        ))}
      </MessageBarGroup>
    </div>
  );
}

export default MyMessageBar;
