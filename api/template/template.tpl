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

\bibliographystyle{plain}
\begin{thebibliography}{9}
<<<reference>>>
\end{thebibliography}

\end{multicols}
\end{document}
