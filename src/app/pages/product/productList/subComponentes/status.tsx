import { SkeletonPage, Layout, LegacyCard, SkeletonBodyText } from "@shopify/polaris";

export const LoadingStatusComponent = () => {
    return (
      <SkeletonPage title="Produtos" primaryAction>
        <Layout>
          <Layout.Section>
            {[1,2,3,4,5,6,7,8].map((item) => {
                return (
                  <LegacyCard sectioned key={item}>
                    <SkeletonBodyText />
                  </LegacyCard>
                );
            })}
          </Layout.Section>
        </Layout>
      </SkeletonPage>
    );
}