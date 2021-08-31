<?php

namespace App\Authorization\Infrastructure\Form;

use App\Authorization\Domain\Role;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AddRoleFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('role_key')
            ->add('name')
            ->add('color')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Role::class,
            // Убираем валидацию sumbit'a
            'validation_groups' => false,
            'csrf_field_name' => '_csrf_token',
            'csrf_token_id'   => 'add_role_form',
        ]);
    }
}
