import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const commentList = document.getElementById("commentList");
const form = document.getElementById("commentForm");
const xBtns = document.querySelectorAll("#xBtn");

const deleteComment = (commentId) => {
    const selectedList = document.querySelector(
      `li.video__comment[data-id='${commentId}']`
    );
    selectedList.remove();
  };
  

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
};



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
            //- 우리가 backend에게 json 보낸다고 알려주는 의미
            "Content-Type": "application/json",
        },
        body:
            JSON.stringify({ text }),

    });

    if (response.status === 201) {

        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }

};

const handleDeleteClick = async (event) => {
    
    const commentId = commentList.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "DELETE",
    });
    
    if (response.status === 200) {
        console.log("yah DeleteComplete");
        deleteComment(commentId);
      }

};

if (form) {

    form.addEventListener("submit", handleSubmit);

};

xBtns.forEach(xBtn => {

    xBtn.addEventListener("click", handleDeleteClick);

});


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