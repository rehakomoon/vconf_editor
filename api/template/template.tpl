\RequirePackage{plautopatch} % pLaTeX非互換のパッケージへのパッチを自動適用
\RequirePackage{fix-cm} % cm フォントのサイズが 10pt でエラーになるのを修正
\documentclass[10pt,a4paper,autodetect-engine,dvipdfmx]{jsarticle} % upLaTeX と pLaTeX2e の判別を自動化, dvipdfmxをグローバルに指定
\usepackage{graphicx} % dvipdfmxはクラスオプションに移動
\usepackage{url}
\usepackage{here}
\usepackage{vconf2023}

\title{<<<title>>>}
\author{<<<author>>>}

% https://puarts.com/?pid=1014
\makeatletter
\newenvironment{tablehere}
  {\def\@captype{table}}
  {}

\newenvironment{figurehere}
  {\def\@captype{figure}}
  {}
\makeatother

\begin{document}
\begin{abstract}
<<<abstract>>>
\end{abstract}

\maketitle

<<<teaser>>>

\begin{multicols}{2}

<<<body>>>

\section*{謝辞}

バーチャル学会2023 LaTeX版テンプレートの作成にあたり，きゅーしす様 (Twitter: @Queue\_sys) にご助言・ご助力いただきました．心より深く感謝申し上げます．

\bibliographystyle{plain}
\begin{thebibliography}{9}
\bibitem{rafferty1994} W. Rafferty, "Ground antennas in NASA’s deep space telecommunications," Proc. IEEE vol. 82, pp. 636-640, May 1994.
\bibitem{vconf2023} バーチャル学会実行委員会, "バーチャル学会2023 Webサイト." \url{https://vconf.org/2023/} (参照 2023-06-30).
\bibitem{okatani2015} 岡谷貴之, "深層学習," 2015.
\bibitem{kataoka2016} Yun He, et al. "Human Action Recognition without Human," In proceedings of the ECCV Workshop, 2016.
\end{thebibliography}

\end{multicols}
\end{document}
