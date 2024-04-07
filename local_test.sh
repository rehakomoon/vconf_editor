curl -X POST \
    -F 'data={"title":"バーチャル学会2023","author":"はこつき(Twitter:@rehakomoon)*,Lcamu(Twitter:@ogtonvr180426)","abstract":"hogehoge","body":[{"title":"section1","text":"このセクション1では...."},{"title":"section2","text":"このセクション2では...."}],"figure":[{"section_index":1,"caption":"figcaption1","position":"top"},{"section_index":1,"caption":"figcaption2","position":"bottom"},{"section_index":2,"caption":"figcaption3","position":"here"},{"section_index":2,"caption":"figcaption4"}]}' \
    -F 'files=@api/template/figure1_dummy.png' \
    -F 'files=@api/template/figure2_dummy.png' \
    -F 'files=@api/template/figure3_dummy.png' \
    -F 'files=@api/template/figure4_dummy.png' \
    -F 'files=@api/template/figure5_dummy.png' \
    --output "./tmp.pdf" \
    'http://0.0.0.0:8000/v1/pdf/create'
