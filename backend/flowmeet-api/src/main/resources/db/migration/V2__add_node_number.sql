-- =========================================================
-- V2__add_node_number.sql
-- 노드 계층 번호(#1.2.3 형태) 부여를 위한 컬럼 추가
-- =========================================================

-- nodes.number: materialized path 형태의 노드 번호
-- nodes.child_seq: 다음 자식에게 부여할 시퀀스 (1부터 증가)
ALTER TABLE nodes
    ADD COLUMN number    VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN child_seq INTEGER      NOT NULL DEFAULT 0;

-- projects.root_node_seq: 프로젝트 내 루트 노드에 부여할 다음 시퀀스
ALTER TABLE projects
    ADD COLUMN root_node_seq INTEGER NOT NULL DEFAULT 0;

-- ---------------------------------------------------------
-- 기존 데이터 백필
-- ---------------------------------------------------------

-- 노드별 형제 내 순번을 미리 계산
WITH ranked AS (
    SELECT
        node_id,
        project_id,
        parent_id,
        ROW_NUMBER() OVER (
            PARTITION BY project_id, COALESCE(parent_id, 0)
            ORDER BY node_id
        ) AS seq
    FROM nodes
    WHERE deleted_at IS NULL
),
-- 루트부터 재귀적으로 number 조립
numbered AS (
    SELECT
        r.node_id,
        r.project_id,
        r.parent_id,
        CAST(r.seq AS VARCHAR) AS number
    FROM ranked r
    WHERE r.parent_id IS NULL

    UNION ALL

    SELECT
        c.node_id,
        c.project_id,
        c.parent_id,
        p.number || '.' || c.seq
    FROM ranked c
    INNER JOIN numbered p ON c.parent_id = p.node_id
)
UPDATE nodes
SET number = numbered.number
FROM numbered
WHERE nodes.node_id = numbered.node_id;

-- 각 노드의 child_seq를 현재 살아있는 자식 수로 세팅
UPDATE nodes p
SET child_seq = sub.cnt
FROM (
    SELECT parent_id, COUNT(*) AS cnt
    FROM nodes
    WHERE parent_id IS NOT NULL AND deleted_at IS NULL
    GROUP BY parent_id
) sub
WHERE p.node_id = sub.parent_id;

-- 각 프로젝트의 root_node_seq를 현재 살아있는 루트 수로 세팅
UPDATE projects p
SET root_node_seq = sub.cnt
FROM (
    SELECT project_id, COUNT(*) AS cnt
    FROM nodes
    WHERE parent_id IS NULL AND deleted_at IS NULL
    GROUP BY project_id
) sub
WHERE p.project_id = sub.project_id;
