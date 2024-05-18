import { useParams } from "react-router-dom";
import { usePageQuery } from "@/features/page/queries/page-query";
import { FullEditor } from "@/features/editor/full-editor";
import HistoryModal from "@/features/page-history/components/history-modal";
import { Helmet } from "react-helmet-async";

export default function Page() {
  const { slugId } = useParams();
  const { data: page, isLoading, isError } = usePageQuery(slugId);

  if (isLoading) {
    return <></>;
  }

  if (isError || !page) {
    // TODO: fix this
    return <div>Error fetching page data.</div>;
  }

  return (
    page && (
      <div>
        <Helmet>
          <title>{page.title}</title>
        </Helmet>
        <FullEditor pageId={page.id} title={page.title} slugId={page.slugId} />
        <HistoryModal pageId={page.id} />
      </div>
    )
  );
}
