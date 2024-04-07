curl -X POST \
    -F 'data={“title”:“バーチャル学会2023”,“author”:“はこつき(Twitter:@re_hako_moon)*,Lcamu(Twitter:@ogtonvr180426)”,“abstract”:“hogehoge”,“body”:[{“section_title”:“fugafuga”,“text”:“このセクションでは....”,},],“teaser”:{“caption”:“~~”},“figure”:[{“section_index”:1,“caption”:“~~”,“position”:“top”,(optional)},]}' \
    -F 'files=@api/template/figure1_dummy.png' \
    -F 'files=@api/template/figure2_dummy.png' \
    -F 'files=@api/template/figure3_dummy.png' \
    -F 'files=@api/template/figure4_dummy.png' \
    -F 'files=@api/template/figure5_dummy.png' \
    'http://0.0.0.0:8000/v1/pdf/create'
