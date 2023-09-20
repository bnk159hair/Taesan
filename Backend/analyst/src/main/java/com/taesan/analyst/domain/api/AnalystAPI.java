package com.taesan.analyst.domain.api;

import com.taesan.analyst.domain.api.dto.request.PlaceAnalystRequest;
import com.taesan.analyst.domain.api.dto.request.ReceiptAnalystRequest;
import com.taesan.analyst.domain.dto.request.ReceiptServiceRequest;
import com.taesan.analyst.domain.dto.response.Info;
import com.taesan.analyst.domain.dto.response.PlaceAnalystResponse;
import com.taesan.analyst.domain.dto.response.ReceiptAnalystResponse;
import com.taesan.analyst.global.api.ApiResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

import static com.taesan.analyst.global.api.ApiResult.OK;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/analyst-management/analysts")
public class AnalystAPI {

    @PostMapping("/place")
    public ApiResult<PlaceAnalystResponse> analyzePlace(@RequestBody PlaceAnalystRequest request) {
        List<Info> infos = new ArrayList<>();
        infos.add(new Info("1", "교통", Long.parseLong("10000")));
        infos.add(new Info("2", "카페", Long.parseLong("30000")));

        PlaceAnalystResponse placeAnalystResponse = new PlaceAnalystResponse();
        placeAnalystResponse.setInfos(infos);
        placeAnalystResponse.setYear("2023");
        placeAnalystResponse.setMonth("9");

        return OK(placeAnalystResponse);
    }

    @PostMapping("/receipt")
    public ApiResult<ReceiptAnalystResponse> analyzePlace(@RequestBody ReceiptAnalystRequest request) {
        List<Info> infos = new ArrayList<>();
        infos.add(new Info("1", "과일/야채", Long.parseLong("10000")));
        infos.add(new Info("2", "즉석식품", Long.parseLong("30000")));
        ReceiptAnalystResponse response = new ReceiptAnalystResponse();
        response.setInfos(infos);
        response.setYear("2023");
        response.setMonth("9");
        return OK(response);
    }

}
