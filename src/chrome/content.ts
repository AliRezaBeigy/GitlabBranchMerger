import {ChromeMessage, MessageType, Repository, Sender} from '../types';

type MessageResponse = (response?: ChromeMessage) => void;

const validateSender = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  if (!validateSender(message, sender)) {
    response();
  }

  if (message.messageType === MessageType.GetCurrentRepository) {
    const aTag = document.querySelector(
      'a[data-qa-menu-item="Project scope"]'
    ) as HTMLAnchorElement;
    const body = document.querySelector('body');
    const repository: Repository = {
      url: aTag.href,
      group: body?.getAttribute('data-group')?.valueOf() ?? '',
      name: body?.getAttribute('data-project')?.valueOf() ?? '',
      id: body?.getAttribute('data-project-id')?.valueOf() ?? '',
    };
    response({
      from: Sender.Content,
      messageType: message.messageType,
      data: repository,
    });
  }
};

const main = () => {
  console.log('[content.ts] Main');
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

main();
