// HTMLの読み込みが終わってからJavaScriptを実行します
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = themeButton.querySelector("i");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.querySelector(".contact-form");
  const formMessage = document.querySelector(".form-message");
  const memberCard = document.querySelector(".member-card");
  const memberIcon = document.querySelector("#memberIcon");
  const memberName = document.querySelector("#memberName");
  const memberText = document.querySelector("#memberText");
  const progressBar = document.querySelector(".scroll-progress span");
  const backToTopButton = document.querySelector(".back-to-top");
  const sections = document.querySelectorAll(".section");

  // 自己紹介カードに表示するメンバー一覧です。
  // 追加したい時は、この配列に同じ形で1人分を足すだけでOKです。
  const members = [
    {
      icon: "fa-solid fa-house-chimney-medical",
      name: "PTの家",
      text: "専門性をやさしく届けることを大切にしているポートフォリオです。見やすさ、使いやすさ、信頼感のある表現を軸に、Webサイト制作に取り組んでいます。",
    },
    {
      icon: "fa-solid fa-heart-pulse",
      name: "ケア担当",
      text: "相手の気持ちに寄り添いながら、安心して読める文章とやさしい導線づくりを意識しています。",
    },
    {
      icon: "fa-solid fa-laptop-code",
      name: "Web担当",
      text: "HTML、CSS、JavaScriptを使って、見た目の美しさと操作のしやすさを両立したページを制作します。",
    },
  ];

  let currentMemberIndex = 0;

  // 保存済みのテーマがあれば、ページ表示時に反映します
  const savedTheme = localStorage.getItem("pt-house-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  // スマートフォン用メニューの開閉
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  // メニュー内のリンクを押したら、メニューを閉じます
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });

  // ダークモードとライトモードを切り替えます
  themeButton.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");

    if (isDark) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("pt-house-theme", "dark");
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("pt-house-theme", "light");
    }
  });

  // 画面に入った要素へactiveクラスを付けて、ふわっと表示します
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // セクションが見えたら、背景の装飾と見出しラインを表示します
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-lit");
        }
      });
    },
    {
      threshold: 0.32,
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // メンバー情報を画面へ反映します
  const showMember = (member) => {
    memberIcon.innerHTML = `<i class="${member.icon}"></i>`;
    memberName.textContent = member.name;
    memberText.textContent = member.text;
  };

  // 4秒ごとに自己紹介カードを3D回転させながら切り替えます
  setInterval(() => {
    memberCard.classList.add("is-rotating");

    setTimeout(() => {
      currentMemberIndex = (currentMemberIndex + 1) % members.length;
      showMember(members[currentMemberIndex]);

      memberCard.classList.remove("is-rotating");
      memberCard.classList.add("is-entering");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          memberCard.classList.remove("is-entering");
        });
      });
    }, 720);
  }, 4000);

  // スクロール量のバーと、ページ上部へ戻るボタンを動かします
  const updateScrollUi = () => {
    const scrollTop = window.scrollY;
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    backToTopButton.classList.toggle("show", scrollTop > 520);
  };

  window.addEventListener("scroll", updateScrollUi);
  updateScrollUi();

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // お問い合わせの送り先メールアドレスです。
  // 自分のメールアドレスに変更すると、その宛先へ送れるようになります。
  const contactMailAddress = "miruk4878@gmail.com";

  // フォーム送信時に、入力内容をメール本文へ入れてメールアプリを開きます。
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const subject = encodeURIComponent("PTの家へのお問い合わせ");
    const body = encodeURIComponent(
      `お名前: ${name}\nメールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`
    );

    window.location.href = `mailto:${contactMailAddress}?subject=${subject}&body=${body}`;

    formMessage.textContent = "メールアプリを開きました。内容を確認して送信してください。";
    contactForm.reset();

    setTimeout(() => {
      formMessage.textContent = "";
    }, 4000);
  });
});
