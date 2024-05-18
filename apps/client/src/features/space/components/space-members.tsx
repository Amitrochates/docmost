import { Group, Table, Text, Menu, ActionIcon } from "@mantine/core";
import { useParams } from "react-router-dom";
import React from "react";
import { IconDots } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { UserAvatar } from "@/components/ui/user-avatar.tsx";
import {
  useChangeSpaceMemberRoleMutation,
  useRemoveSpaceMemberMutation,
  useSpaceMembersQuery,
} from "@/features/space/queries/space-query.ts";
import { IconGroupCircle } from "@/components/icons/icon-people-circle.tsx";
import { IRemoveSpaceMember } from "@/features/space/types/space.types.ts";
import RoleSelectMenu from "@/components/ui/role-select-menu.tsx";
import {
  getSpaceRoleLabel,
  spaceRoleData,
} from "@/features/space/types/space-role-data.ts";

type MemberType = "user" | "group";
interface SpaceMembersProps {
  spaceId: string;
}
export default function SpaceMembersList({ spaceId }: SpaceMembersProps) {
  const { data, isLoading } = useSpaceMembersQuery(spaceId);
  const removeSpaceMember = useRemoveSpaceMemberMutation();
  const changeSpaceMemberRoleMutation = useChangeSpaceMemberRoleMutation();

  const handleRoleChange = async (
    memberId: string,
    type: MemberType,
    newRole: string,
    currentRole: string,
  ) => {
    if (newRole === currentRole) {
      return;
    }

    const memberRoleUpdate: {
      spaceId: string;
      role: string;
      userId?: string;
      groupId?: string;
    } = {
      spaceId: spaceId,
      role: newRole,
    };

    if (type === "user") {
      memberRoleUpdate.userId = memberId;
    }
    if (type === "group") {
      memberRoleUpdate.groupId = memberId;
    }

    await changeSpaceMemberRoleMutation.mutateAsync(memberRoleUpdate);
  };

  const onRemove = async (memberId: string, type: MemberType) => {
    const memberToRemove: IRemoveSpaceMember = {
      spaceId: spaceId,
    };

    if (type === "user") {
      memberToRemove.userId = memberId;
    }
    if (type === "group") {
      memberToRemove.groupId = memberId;
    }

    await removeSpaceMember.mutateAsync(memberToRemove);
  };

  const openRemoveModal = (memberId: string, type: MemberType) =>
    modals.openConfirmModal({
      title: "Remove space member",
      children: (
        <Text size="sm">
          Are you sure you want to remove this user from the space? The user
          will lose all access to this space.
        </Text>
      ),
      centered: true,
      labels: { confirm: "Remove", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => onRemove(memberId, type),
    });

  return (
    <>
      {data && (
        <Table verticalSpacing={8}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Member</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {data?.items.map((member, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Group gap="sm">
                    {member.type === "user" && (
                      <UserAvatar
                        avatarUrl={member?.avatarUrl}
                        name={member.name}
                      />
                    )}

                    {member.type === "group" && <IconGroupCircle />}

                    <div>
                      <Text fz="sm" fw={500}>
                        {member?.name}
                      </Text>
                      <Text fz="xs" c="dimmed">
                        {member.type == "user" && member?.email}

                        {member.type == "group" &&
                          `Group - ${member?.memberCount === 1 ? "1 member" : `${member?.memberCount} members`}`}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>

                <Table.Td>
                  <RoleSelectMenu
                    roles={spaceRoleData}
                    roleName={getSpaceRoleLabel(member.role)}
                    onChange={(newRole) =>
                      handleRoleChange(
                        member.id,
                        member.type,
                        newRole,
                        member.role,
                      )
                    }
                  />
                </Table.Td>

                <Table.Td>
                  <Menu
                    shadow="xl"
                    position="bottom-end"
                    offset={20}
                    width={200}
                    withArrow
                    arrowPosition="center"
                  >
                    <Menu.Target>
                      <ActionIcon variant="subtle" c="gray">
                        <IconDots size={20} stroke={2} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => openRemoveModal(member.id, member.type)}
                      >
                        Remove space member
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
