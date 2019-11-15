window.addEventListener('load',function(){
    //google listener
    $('.google-register-button').on('click',()=>{
        location.href="/guest/auth/google";
    })
    $('.facebook-register-button').on('click',()=>{
        location.href="/guest/auth/facebook";
    })
    //header listener
    document.querySelector('#welcomeTitleUsername').textContent = "Guest";
    let elements = document.getElementsByClassName('loginModal');
    Array.from(elements).forEach(function(item){
        item.addEventListener('click',function(event){
            event.preventDefault();
            $('#loginModal').modal('show');
        })
    });
    document.querySelector('#registerButton').addEventListener('click',function(event){
        this.style.backgroundColor = "#e40f0f";
        location.href="/guest/register";
    })
    document.querySelector('#loginButton').addEventListener('click',function(event){
        var obj = {
            'preferredLoginName':document.querySelector('#loginModalUsername').value,
            'password':document.querySelector('#loginModalPassword').value
        }
        fetch('/userapi/authenticateuser',{
            headers:{
                'password':obj.password,
                'preferredLoginName':obj.preferredLoginName
            }
        }).then(function(response){
            return response.text();
        }).then(function(data){
            if(data==="false"){
                document.querySelector('#loginFailed').style.display = "block";
            }else{
                location.href="/user/home";
            }
        })
    })
});