import React, { useEffect, useState } from "react";
import './editor.scss';

import {
} from "@ant-design/icons";

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Cloudservices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';

import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Attributecommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Fontsize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';

import Link from '@ckeditor/ckeditor5-link/src/link';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';

import List from '@ckeditor/ckeditor5-list/src/list';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';

import { useTranslation } from "react-i18next";

const Editor = (props) => {
  const {
    id,
    project = null,
    disabled = false,
    value = null,
    type = 'comment',
    onChange = () => { }
  } = props;

  const [editor, setEditor] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (editor) {
      if (disabled) {
        editor.enableReadOnlyMode(`note-${id}`);
      } else {
        editor.disableReadOnlyMode(`note-${id}`);
      }
    }
  }, [disabled, editor])

  useEffect(() => {
    if (editor) {
      editor.setData(value)
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      editor.destroy()
    }
    ClassicEditor
      .create(document.querySelector(`#note-${id}`), {
        extraPlugins: [
          Cloudservices,
          Paragraph,
          Essentials,
          Heading,

          Mention,

          Code,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Attributecommand,
          Subscript,
          Superscript,

          FontFamily,
          Fontsize,
          FontColor,
          FontBackgroundColor,

          Link,

          UploadAdapter,
          Autoformat,
          BlockQuote,
          CodeBlock,

          EasyImage,
          Image,
          ImageCaption,
          ImageStyle,
          ImageToolbar,
          ImageUpload,

          List,
          TodoList,

          MentionLinks
        ],
        toolbar: {
          items: [
            'undo', 'redo',
            '|', 'heading',
            '|', 'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
            '|', 'link', 'uploadImage', 'blockQuote', 'codeBlock',
            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
          ]
        },
        mention: {
          feeds: [
            {
              marker: '@',
              feed: getFeedItems,
              itemRenderer: customItemRenderer
            },
            {
              marker: '#',
              feed: []
            }
          ]
        },
      })
      .then(editor => {
        editor.editing.view.focus();
        setEditor(editor);
        editor.model.document.on('change:data', (evt, _) => {
          onChange(evt, editor)
        });
      })
      .catch(err => {
        console.error(err.stack);
      });
  }, [type])

  async function getFeedItems(v) {
    return [].map((m) => ({
      user_id: m.member_id,
      ...m.user,
      id: `@${m.user.email.split('@')[0]}`,
      link: `${window.location.host}/members/${m.member_id}/detail`
    }))
  }

  function MentionLinks(editor) {
    editor.conversion.for('upcast').elementToAttribute({
      view: {
        name: 'a',
        key: 'data-mention',
        classes: 'mention',
        attributes: {
          href: true
        }
      },
      model: {
        key: 'mention',
        value: viewItem => {
          const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
            link: viewItem.getAttribute('href'),
          });
          return mentionAttribute;
        }
      },
      converterPriority: 'high'
    });

    editor.conversion.for('downcast').attributeToElement({
      model: 'mention',
      view: (modelAttributeValue, { writer }) => {
        if (!modelAttributeValue) {
          return;
        }
        return writer.createAttributeElement('a', {
          class: 'mention',
          target: '_blank',
          'data-mention': modelAttributeValue.id,
          href: modelAttributeValue.link
        }, {
          priority: 20,
          id: modelAttributeValue.uid
        });
      },
      converterPriority: 'high'
    });
  }

  function customItemRenderer(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('mention__item');

    const avatar = document.createElement('img');
    const right = document.createElement('div');
    right.classList.add('mention__item--right');

    const userNameElement = document.createElement('p');
    userNameElement.classList.add('mention__item--right__user-name');

    const fullNameElement = document.createElement('p');
    fullNameElement.classList.add('mention__item--right__full-name');

    avatar.src = item.avatar;

    userNameElement.textContent = item.email;

    fullNameElement.textContent = item.full_name;

    itemElement.appendChild(avatar);
    itemElement.appendChild(right);

    right.appendChild(fullNameElement);
    right.appendChild(userNameElement);

    return itemElement;
  }

  return (
    <textarea
      id={`note-${id}`}
      placeholder={t(`placeholder.${type}`)}
      style={{
        display: 'none'
      }}
    ></textarea>
  );
}

export default Editor;