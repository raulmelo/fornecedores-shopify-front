import { useCallback, useState } from "react";
import { Button, Popover, ActionList, Text } from "@shopify/polaris";
import { BusinessResponseType } from "src/app/types/Business.types";
import { TitleToSlug } from "src/app/utilities/slug-url";
import BusinessServices from "src/app/api/Business";
import { Link } from "react-router-dom";
import { ROLES_TYPES } from "src/app/constants/roles";

interface BusinessCardProps {
  business: BusinessResponseType
  onAddUser: (id: number | string) => void
  onDisabledBusiness: (id: number | string) => void
  onUpdatedBusiness: () => void
  role: ROLES_TYPES
}

export default function BusinessCard(props: BusinessCardProps) {
  const  { business } = props;
  
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  

  function enabledBusiness() {
    BusinessServices.enabledBusiness(props.business.id).then((_: any) => {
      props.onUpdatedBusiness();
    })
  }

  const activator = (
    <Button onClick={toggleActive} disclosure>
      Ações
    </Button>
  )

  const popoverBusiness = !props.business.disabled ? (
    <Popover
      active={active}
      activator={activator}
      autofocusTarget="first-node"
      onClose={toggleActive}
    >
      <ActionList
        actionRole="menuitem"
        items={[
          {
            content: "gerenciar fornecedor",
            onAction: () => {
              toggleActive();
              props.onAddUser(business.id);
            },
          },
          {
            content: "desativar empresa",
            destructive: true,
            onAction: () => {
              toggleActive();
              props.onDisabledBusiness(business.id);
            },
          },
        ]}
      />
    </Popover>
  ) : (
    <Button onClick={() => enabledBusiness()}>Habilitar empresa</Button>
  );

  
  return (
    <div>
      <div
        className={`
        grid relative card-business-grid w-full min-h-24 rounded-lg mb-3 
        ${
          props.business.disabled
            ? "bg-slate-300 opacity-60 p-2"
            : "bg-white p-5 "
        }`}
      >
        <div className="w-[150px] h-[160px]">
          <img
            src={business.imageUrl}
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
        <div>
          <div className="flex justify-between items-start">
            <div>
              <Text variant="headingXl" as="h2">
                <strong>{business.title}</strong>
              </Text>
              <Text variant="bodyMd" as="p">
                {business.body_html}
              </Text>
            </div>
            { props.role === 'MASTER' && (
                <div>{popoverBusiness}</div>
            )}
          </div>

          <div className="py-3 block">
            <hr />
          </div>
          <Text variant="bodyMd" as="p">
            {business?.users ? business?.users.length > 1 && (
              <strong>toral de fornecedores: {business ? business?.users?.length : ''}</strong> 
            ) : null}
            <br />
            <strong>Link da seção: </strong>
            <a
              href={
                `https://my_project.com.br/collections/` +
                TitleToSlug(business.title)
              }
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              https://my_project.com.br/collections/{TitleToSlug(business.title)}
            </a>
          </Text>
          <div className="my-4">
            <Link 
              to={`/produtos/${business.id}/list`}
              state={{ business: business }}
            >
              <Button
                variant="primary" 
                tone="success"
              >Produtos</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );


}
