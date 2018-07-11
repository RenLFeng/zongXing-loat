import React from 'react';
import { EditorState, convertToRaw, ContentState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './index.less';

export default class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.htmltoDraftConvert(props.value)
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        editorState: this.htmltoDraftConvert(nextProps.value)
      });
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
          wrapperClassName={styles["demo-wrapper"]}
          editorClassName={styles['demo-editor']}
          toolbarStyle={{display: 'none'}}
          readOnly={true}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: [],
          }}
        />
      </div>
    )
  }
}