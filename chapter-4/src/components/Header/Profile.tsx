import { Flex, Box, Avatar, Text } from "@chakra-ui/react";

interface ProfileProps {
  showProfileData?: boolean;
}

export function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {
        showProfileData && (

      <Box mr="4" textAlign="right">
        <Text>Cleyson Silva</Text>
        <Text color="gray.300" fontSize="small">
          cleysonsilva.me@gmail.com
        </Text>
      </Box>
        )
      }

      <Avatar
        size="md"
        name="Cleyson Silva"
        src="https://github.com/cleysonsilvame.png"
      />
    </Flex>
  );
}
