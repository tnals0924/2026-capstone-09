package kr.flowmeet.domain.node.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import kr.flowmeet.common.exception.ErrorCode;

@Getter
@RequiredArgsConstructor
public enum TagErrorCode implements ErrorCode {
    TAG_NOT_FOUND(HttpStatus.NOT_FOUND, "존재하지 않는 태그입니다."),
    TAG_NAME_DUPLICATED(HttpStatus.CONFLICT, "동일한 이름의 태그가 이미 존재합니다."),
    NODE_TAG_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 연결된 태그입니다."),
    TAG_CREATE_FORBIDDEN(HttpStatus.FORBIDDEN, "태그를 생성할 권한이 없습니다."),
    TAG_UPDATE_FORBIDDEN(HttpStatus.FORBIDDEN, "태그를 수정할 권한이 없습니다."),
    TAG_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "태그를 삭제할 권한이 없습니다."),
    NODE_TAG_ADD_FORBIDDEN(HttpStatus.FORBIDDEN, "노드에 태그를 지정할 권한이 없습니다."),
    NODE_TAG_DELETE_FORBIDDEN(HttpStatus.FORBIDDEN, "노드에 지정된 태그를 삭제할 권한이 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}