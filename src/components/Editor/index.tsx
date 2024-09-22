import React, {useEffect, useMemo, useRef, useState} from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const formats = [
    'font',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'align',
    'color',
    'background',
    'size',
    'h1',
    'image'
];

interface Props {
    editorRef: React.RefObject<ReactQuill>;
    setContentHtml: (content: string) => void;
}
const Editor = ({editorRef, setContentHtml}: Props) => {
    const imageHandler = () => {
        console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

        // 1. 이미지를 저장할 input type=file DOM을 만든다.
        const input = document.createElement('input');
        // 속성 써주기
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
        // input이 클릭되면 파일 선택창이 나타난다.

        // input에 변화가 생긴다면 = 이미지를 선택
        input.addEventListener('change', async () => {
            console.log('온체인지');
            if (!input.files) return;
            const file = input.files[0];
            // multer에 맞는 형식으로 데이터 만들어준다.
            const formData = new FormData();
            formData.append('file', file); // formData는 키-밸류 구조
            // 백엔드 multer라우터에 이미지를 보낸다.
            try {
                if (!apiDomain) {
                    console.error('API_DOMAIN이 없습니다.');
                    return;
                }
                const result = await axios.post(`${apiDomain}/file/save/image`, formData);
                console.log('성공 시, 백엔드가 보내주는 데이터', result);
                const IMG_URL = result.data.fileUrl;
                // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
                // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
                // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.

                // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
                const editor = editorRef.current?.getEditor(); // 에디터 객체 가져오기
                // 1. 에디터 root의 innerHTML을 수정해주기
                // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
                // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
                // editor.root.innerHTML =
                //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

                // 2. 현재 에디터 커서 위치값을 가져온다
                if(!editor) return;
                const range = editor.getSelection();
                // 가져온 위치에 이미지를 삽입한다
                if (!range) return;
                editor.insertEmbed(range.index, 'image', IMG_URL);
            } catch (error) {
                console.log(error);
                console.log('실패했어요ㅠ');
            }
        });
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ size: ['small', false, 'large', 'huge'] }],
                    ["image"],
                    [{ align: [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [
                        {
                            color: [],
                        },
                        { background: [] },
                    ],
                ],
                handlers: {
                    image: imageHandler,
                }
            },
        };
    }, []);

    const apiDomain = process.env.REACT_APP_API_DOMAIN;
    // 이미지 처리를 하는 핸들러


    return (
        <ReactQuill theme="snow"
                    ref={editorRef}
                    modules={modules}
                    formats={formats}
                    style={{height: "100%", width: "100%"}}
                    onChange={setContentHtml}/>
    );
};

export default Editor;