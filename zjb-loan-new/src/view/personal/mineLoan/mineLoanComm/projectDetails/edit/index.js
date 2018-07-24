import React from 'react';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './index.scss';

export default class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.htmltoDraftConvert(props.value)
    }
  }
 
  htmltoDraftConvert(content) {
    const blocksFromHtml = htmlToDraft(content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    })
  };
  
  returnValue() {
    return this.state.editorState;
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName={'demo-editor'}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: ['inline', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'remove', 'history'],
            inline: {
              inDropdown: false,
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
            },
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            fontSize: {
              options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            fontFamily: {
              options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
            list: {
              inDropdown: false,
              className: undefined,
              component: undefined, 
              dropdownClassName: undefined,
              options: ['unordered', 'ordered', 'indent', 'outdent'],
            },
            textAlign: {
              inDropdown: false,
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              options: ['left', 'center', 'right', 'justify'],
            },
            colorPicker: {
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
            },
            embedded: {
              className: undefined,
              component: undefined,
              popupClassName: undefined,
              defaultSize: {
                height: 'auto',
                width: 'auto',
              },
            },
            remove: { className: undefined, component: undefined },
            history: {
              inDropdown: false,
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
              options: ['undo', 'redo'],
            },
          }}
        />
      </div>
    )
  }
}