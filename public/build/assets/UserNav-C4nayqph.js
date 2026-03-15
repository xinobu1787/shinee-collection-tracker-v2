import{j as e,L as t}from"./app-DJpzkwYC.js";function s({auth:a}){const r=`
    bg-white border border-solid border-[var(--member-color)]
    rounded-[2rem] py-[0.4rem] px-[1rem]
    text-[0.8rem] text-[#666] shadow-sm
    transition-all duration-200 ease-in-out
    hover:-translate-y-[1px] hover:bg-[#f0fdfa]
`;return e.jsx("nav",{className:"w-full flex justify-end gap-4 px-4",children:a.user?e.jsx(t,{href:route("logout",{redirect:window.location.pathname}),method:"post",as:"button",className:r,children:"ログアウト"}):e.jsxs(e.Fragment,{children:[e.jsx(t,{href:route("login",{redirect:window.location.pathname}),className:r,children:"ログイン"}),e.jsx(t,{href:route("register",{redirect:window.location.pathname}),className:r,children:"新規登録"})]})})}export{s as U};
