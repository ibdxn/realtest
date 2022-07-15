
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");


const handleSubmit = (event) => {

    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: { //- header = 기본적으로 fetch로 정보 보낼때
            //- req에 추가할수 있는 정보
            "Content-Type": "application/json",
        },
        body:
            JSON.stringify({ text }),

    });

};

if (form) {
    form.addEventListener("submit", handleSubmit)

}


