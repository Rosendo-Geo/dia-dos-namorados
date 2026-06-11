let current=0;
const pages=document.querySelectorAll('.page');
function nextPage(){
 pages[current].style.display='none';
 current=Math.min(current+1,pages.length-1);
 pages[current].style.display='flex';
}
const start=new Date('2017-08-23');
const today=new Date();
const target=Math.floor((today-start)/(1000*60*60*24));
let n=0;
const el=document.getElementById('counter');
const t=setInterval(()=>{
 n+=20;
 if(n>=target){n=target;clearInterval(t);}
 if(el) el.textContent=n;
},10);
