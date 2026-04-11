package kr.flowmeet.external.file;

import java.net.URL;

public interface FileStorageService {

    URL generatePresignedUrl(String fileKey, String contentType);

    boolean doesObjectExist(String fileKey);

    void deleteObject(String fileKey);

    String getPublicUrl(String fileKey);
}
