curl -X POST \
    -F "data=$(cat local_test_data.json)" \
    -F 'teaser=@api/template/vconf2023.png' \
    -F 'files=@api/template/figure1_dummy.png' \
    -F 'files=@api/template/figure2_dummy.png' \
    -F 'files=@api/template/figure3_dummy.png' \
    -F 'files=@api/template/figure4_dummy.png' \
    -F 'files=@api/template/figure5_dummy.png' \
    --output "./tmp.pdf" \
    'http://0.0.0.0:8000/v1/pdf/create'
