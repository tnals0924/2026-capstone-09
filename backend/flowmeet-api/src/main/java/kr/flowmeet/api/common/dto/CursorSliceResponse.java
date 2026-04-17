package kr.flowmeet.api.common.dto;

import java.util.List;
import kr.flowmeet.domain.common.dto.CursorSlice;

public record CursorSliceResponse<T>(
        List<T> content,
        int size,
        boolean hasNext,
        Long nextCursorId,
        String nextCursorValue
) {

    public static <T> CursorSliceResponse<T> from(final CursorSlice<T> slice, final int size) {
        return new CursorSliceResponse<>(
                slice.content(),
                size,
                slice.hasNext(),
                slice.nextCursorId(),
                slice.nextCursorValue()
        );
    }
}
