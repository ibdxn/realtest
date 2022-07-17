import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span")
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span.innerText = "❌"
    newComment.appendChild(icon);
    newComment.appendChild(span); 
    newComment.appendChild(span2); 
    videoComments.prepend(newComment); 

}

const handleSubmit = async (event) => {

    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: { //- header = 기본적으로 fetch로 정보 보낼때
            //- req에 추가할수 있는 정보
            //- 우리가 backenddprp json 보낸다고 알려주는 의미
            "Content-Type": "application/json",
        },
        body:
            JSON.stringify({ text }),

    });
    if(response.status === 201) {
        
        textarea.value = "";
        const {newCommentId} = await response.json(); 
        addComment(text, newCommentId);
     }

};

if (form) {
    form.addEventListener("submit", handleSubmit)

}

/*
challenge

1st check 댓글 작성자만 엑스버튼 보이게하기
2. 버튼 클릭했을때 댓글이 사라지게 만들어야함

const response = await fetch(`/api/comments/${commentId}/comment`, {
        method: "DELETE",

router.delete("/dkfjsl",fn)

eventlistner // delete req // 

handleEnded ref

2nd check 사용자가 그댓글 작성자 맞는지 확인(deletevideo ref)

*/