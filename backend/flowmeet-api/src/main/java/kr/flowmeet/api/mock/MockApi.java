package kr.flowmeet.api.mock;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import kr.flowmeet.api.common.dto.CommonResponse;
import kr.flowmeet.api.mock.dto.CreateMockRequest;
import kr.flowmeet.api.mock.dto.GetAllMocksResponse;
import kr.flowmeet.auth.annotation.UserId;

@Tag(name = "Mock")
public interface MockApi {

    @Operation(summary = "Mock 생성")
    CommonResponse<?> createMock(@UserId Long userId, @Valid @RequestBody CreateMockRequest request);

    @Operation(summary = "Mock 목록 조회")
    CommonResponse<GetAllMocksResponse> getAllMocks(@UserId Long userId);
}
