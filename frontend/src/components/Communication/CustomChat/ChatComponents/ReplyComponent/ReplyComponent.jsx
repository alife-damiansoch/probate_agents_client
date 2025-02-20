import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
} from 'react-icons/fa';
import { RxFontStyle } from 'react-icons/rx';
import { TfiLayoutListPost } from 'react-icons/tfi';
import draftToHtml from 'draftjs-to-html';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { useCallback, useState, useEffect } from 'react';
import { postData } from '../../../../GenericFunctions/AxiosGenericFunctions';
import AttachmentsComponent from '../AttachmentsComponent/AttachmentsComponent';
import renderErrors from '../../../../GenericFunctions/HelperGenericFunctions';

const ReplyComponent = ({
  emailLogId,
  setRefresh,
  refresh,
  setShowReply,
  application_id,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // State to hold selected files
  const [error, setError] = useState(null);
  const [useInfoEmail] = useState(true);

  // useCallback to memoize handleFileChange, ensuring it doesn't cause re-renders
  const handleFileChange = useCallback((e) => {
    const newFilesArray = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
  }, []);

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const send_message_handler = async () => {
    setSending(true);
    setError(null);

    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const messageHtml = draftToHtml(rawContent);

    const strippedContent = contentState.getPlainText().trim();

    if (strippedContent === '') {
      setError({ message: 'Message content are required' });
      setSending(false);
    } else {
      const formData = new FormData();
      formData.append('email_log_id', emailLogId);
      formData.append('message', messageHtml);
      formData.append('use_info_email', useInfoEmail);

      // Append files to formData
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('attachments', selectedFiles[i]);
      }

      try {
        let endpoint = `/api/communications/reply/`;
        if (parseInt(application_id) === -2) {
          endpoint = `/api/communications/user_emails/reply/`;
        }

        console.log(endpoint);

        const res = await postData('token', endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.status === 200) {
          console.log('Email sent successfully');
          setEditorState(EditorState.createEmpty());
          setSelectedFiles([]);
          setRefresh(!refresh);
          setShowReply(false);
        } else {
          setError(res.data);
        }
      } catch (error) {
        setError(error.message);
        console.error('Error sending email:', error);
      } finally {
        setSending(false);
      }
    }
  };

  // Log files only when new files are added
  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]); // Log only when `selectedFiles` state changes

  return (
    <div className=' card bg-info rounded shadow'>
      <div className='card-header'>
        <h5 className=' text-light'>Reply</h5>
      </div>
      <div className=' card-body'>
        <div className='text-editor-toolbar mb-2 d-flex justify-content-end'>
          <div className='dropdown me-2 '>
            <button
              className='btn btn-sm btn-outline-dark dropdown-toggle border-0'
              type='button'
              data-bs-toggle='dropdown'
            >
              <RxFontStyle size={30} className=' icon-shadow' />
            </button>
            <ul className='dropdown-menu'>
              <li>
                <button
                  className='dropdown-item'
                  onClick={() => toggleInlineStyle('BOLD')}
                >
                  <FaBold /> Bold
                </button>
              </li>
              <li>
                <button
                  className='dropdown-item'
                  onClick={() => toggleInlineStyle('ITALIC')}
                >
                  <FaItalic /> Italic
                </button>
              </li>
              <li>
                <button
                  className='dropdown-item'
                  onClick={() => toggleInlineStyle('UNDERLINE')}
                >
                  <FaUnderline /> Underline
                </button>
              </li>
            </ul>
          </div>
          <div className='dropdown me-2'>
            <button
              className='btn btn-sm btn-outline-dark dropdown-toggle border-0'
              type='button'
              data-bs-toggle='dropdown'
            >
              <TfiLayoutListPost size={30} className=' icon-shadow' />
            </button>
            <ul className='dropdown-menu'>
              <li>
                <button
                  className='dropdown-item'
                  onClick={() => toggleBlockType('unordered-list-item')}
                >
                  <FaListUl /> Bullet List
                </button>
              </li>
              <li>
                <button
                  className='dropdown-item'
                  onClick={() => toggleBlockType('ordered-list-item')}
                >
                  <FaListOl /> Numbered List
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div
          className='editor bg-light text-dark p-2 shadow'
          style={{
            minHeight: '200px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
          }}
        >
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            handleKeyCommand={handleKeyCommand}
            placeholder='Type your message...'
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className='d-flex flex-column mt-2  text-start'>
            <h6>Attached files:</h6>
            {selectedFiles.map((file) => (
              <span key={file.name} className='text-success'>
                {file.name}
              </span>
            ))}
          </div>
        )}

        <AttachmentsComponent handleFileChange={handleFileChange} />
        {/* This can be uncommented if we want to allow users to sent emails from their own email address */}
        {/* <div className=' row mx-0 alert alert-info'>
          <div className='form-group mb-3'>
            <div className='form-check d-flex align-items-center'>
              <input
                type='checkbox'
                className='form-check-input me-2'
                id='useInfoEmailCheckbox'
                checked={useInfoEmail}
                onChange={(e) => setUseInfoEmail(e.target.checked)}
              />
              {useInfoEmail ? (
                <label
                  className='form-check-label mx-auto text-info'
                  htmlFor='useInfoEmailCheckbox'
                >
                  This emails will be sent from the{' '}
                  <span className=' text-danger'>general info@ address</span>.{' '}
                  <br /> If you prefer to use your personal email address,
                  please uncheck this option.
                </label>
              ) : (
                <label
                  className='form-check-label mx-auto text-info'
                  htmlFor='useInfoEmailCheckbox'
                >
                  This emails will be sent from the your{' '}
                  <span className=' text-danger'> personal email address</span>
                  . <br />
                  If you prefer to use general info@ address , please check this
                  option.
                </label>
              )}
            </div>
          </div>
        </div> */}
        <hr />
        <div className='d-flex align-items-center justify-content-end'>
          <div className='mx-2'>
            <button
              className='btn btn-sm btn-outline-primary shadow'
              onClick={() => setEditorState(EditorState.createEmpty())}
              disabled={sending}
            >
              Clear
            </button>
          </div>
          <div className=''>
            <button
              className='btn btn-sm btn-outline-success shadow'
              onClick={send_message_handler}
              disabled={sending}
            >
              {!sending ? 'Send' : 'Sending...'}
            </button>
          </div>
        </div>
        {error !== null && (
          <div
            className='col-8 mx-auto alert alert-danger text-center shadow py-0'
            role='alert'
          >
            {renderErrors([{ error }])}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyComponent;
