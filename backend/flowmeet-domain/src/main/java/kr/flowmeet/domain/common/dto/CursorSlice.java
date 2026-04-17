package kr.flowmeet.domain.common.dto;

import java.util.List;
import java.util.function.Function;

public record CursorSlice<T>(
        List<T> content,
        boolean hasNext,
        Long nextCursorId,
        String nextCursorValue
) {

    public <R> CursorSlice<R> map(final Function<T, R> mapper) {
        return new CursorSlice<>(
                content.stream().map(mapper).toList(),
                hasNext,
                nextCursorId,
                nextCursorValue
        );
    }
}
